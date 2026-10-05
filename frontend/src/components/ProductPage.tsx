import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";

import ProductShowcase, {
    Product,
} from "@/components/Productshowcase";

import api from "@/lib/axios";
import { addToCart } from "@/lib/cart";

import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import type { ShippingAddress } from "@/components/checkout/ShippingForm";

import {
    createBuyNowOrder,
    verifyRazorpayPayment,
} from "@/lib/payment";


// --------------------------------------------------
// FETCH PRODUCT
// --------------------------------------------------

async function fetchProduct(id: string): Promise<Product> {
    try {
        const res = await api.get(`/products/${id}`);

        return mapProduct(res.data);
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message ||
                `Product not found (status ${error.response?.status})`
        );
    }
}


// --------------------------------------------------
// MAP BACKEND PRODUCT -> PRODUCT SHOWCASE PRODUCT
// --------------------------------------------------

function mapProduct(data: any): Product {
    const product = data.product;

    return {
        id: product._id,

        name: product.name,

        description: product.description || "",

        price: product.price,

        compareAtPrice: product.compareAtPrice,

        currency: product.currency || "INR",

        images: (product.images || []).map((img: any) => ({
            url: img.url,
            public_id: img.public_id,
        })),

        variantLabel: product.variantLabel || "Fabric",

        variants: (product.variants || []).map((v: any) => ({
            id: v.sku || v._id,
            label: v.label,
            price: v.price,
            inStock: v.inStock,
            stockQuantity: v.stockQuantity,
        })),

        badges: product.badges || [
            {
                icon: "🚚",
                title: "Free Delivery and Installation",
                subtitle: "No hidden cost",
            },
            {
                icon: "🛡️",
                title: "Manufacturing Warranty",
                subtitle: "5 yrs Manufacturing Warranty",
            },
            {
                icon: "🎯",
                title: "Made on Orders only",
                subtitle: "Customisable in every aspect",
            },
        ],

        accordion: product.accordion || [],

        inStock: product.inStock,
    };
}


// --------------------------------------------------
// PRODUCT PAGE
// --------------------------------------------------

export default function ProductPage() {
    const { id: productId } = useParams({
        from: "/product/$id/",
    });

    const navigate = useNavigate();


    // -----------------------------------------------
    // PRODUCT STATE
    // -----------------------------------------------

    const [product, setProduct] =
        useState<Product | undefined>(undefined);

    const [loading, setLoading] = useState(true);

    const [error, setError] =
        useState<string | null>(null);


    // -----------------------------------------------
    // CART STATE
    // -----------------------------------------------

    const [addingToCart, setAddingToCart] =
        useState(false);


    // -----------------------------------------------
    // BUY NOW STATE
    // -----------------------------------------------

    const [buyingNow, setBuyingNow] =
        useState(false);


    // -----------------------------------------------
    // CHECKOUT MODAL
    // -----------------------------------------------

    const [checkoutOpen, setCheckoutOpen] =
        useState(false);


    // -----------------------------------------------
    // SELECTED BUY NOW ITEM
    // -----------------------------------------------

    const [buyNowPayload, setBuyNowPayload] = useState<{
        productId: string;
        variantId?: string;
        quantity: number;
    } | null>(null);


    // -----------------------------------------------
    // FETCH PRODUCT
    // -----------------------------------------------

    useEffect(() => {
        if (!productId) return;

        let cancelled = false;

        setLoading(true);
        setError(null);

        fetchProduct(productId)
            .then((p) => {
                if (!cancelled) {
                    setProduct(p);
                }
            })
            .catch((e) => {
                if (!cancelled) {
                    setError(
                        e.message ??
                            "Something went wrong"
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [productId]);


    // --------------------------------------------------
    // ADD TO CART
    // --------------------------------------------------

    const handleAddToCart = async (payload: {
        productId: string;
        variantId?: string;
        quantity: number;
    }) => {
        if (addingToCart) return;

        try {
            setAddingToCart(true);

            await addToCart(
                payload.productId,
                payload.quantity,
                payload.variantId ?? null
            );

            alert("Added to cart");
        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            alert(
                error instanceof Error
                    ? error.message
                    : "Unable to add product to cart"
            );
        } finally {
            setAddingToCart(false);
        }
    };


    // --------------------------------------------------
    // BUY NOW
    // --------------------------------------------------

    const handleBuyNow = (payload: {
        productId: string;
        variantId?: string;
        quantity: number;
    }) => {
        if (buyingNow) return;

        setBuyNowPayload(payload);

        setCheckoutOpen(true);
    };


    // --------------------------------------------------
    // CHECKOUT SUBMIT
    // --------------------------------------------------

    const handleCheckout = async (
        shippingAddress: ShippingAddress
    ) => {
        if (!buyNowPayload || !product) {
            return;
        }

        try {
            setBuyingNow(true);


            // ------------------------------------------
            // CREATE BACKEND ORDER
            // ------------------------------------------

            const data = await createBuyNowOrder({
                productId: buyNowPayload.productId,

                quantity: buyNowPayload.quantity,

                variant:
                    buyNowPayload.variantId ?? null,

                shippingAddress,
            });


            if (!data.success) {
                throw new Error(
                    "Unable to create payment order"
                );
            }


            // ------------------------------------------
            // RAZORPAY KEY
            // ------------------------------------------

            const razorpayKey =
                import.meta.env.VITE_RAZORPAY_KEY_ID;

            if (!razorpayKey) {
                throw new Error(
                    "Razorpay key is not configured."
                );
            }


            // ------------------------------------------
            // CHECK RAZORPAY SCRIPT
            // ------------------------------------------

            if (!window.Razorpay) {
                throw new Error(
                    "Razorpay checkout failed to load."
                );
            }


            // ------------------------------------------
            // FIND SELECTED VARIANT
            // ------------------------------------------

            const selectedVariant =
                product.variants?.find(
                    (variant) =>
                        variant.id ===
                        buyNowPayload.variantId
                );


            // ------------------------------------------
            // RAZORPAY OPTIONS
            // ------------------------------------------

            const options = {
                key: razorpayKey,

                amount: data.razorpay.amount,

                currency:
                    data.razorpay.currency,

                name: "Decor Den",

                description:
                    selectedVariant
                        ? `${product.name} - ${selectedVariant.label}`
                        : product.name,

                order_id:
                    data.razorpay.orderId,

                theme: {
                    color: "#183C2D",
                },


                // --------------------------------------
                // PAYMENT SUCCESS
                // --------------------------------------

                handler: async (response: {
                    razorpay_order_id: string;
                    razorpay_payment_id: string;
                    razorpay_signature: string;
                }) => {
                    try {
                        const verifyResponse =
                            await verifyRazorpayPayment({
                                razorpay_order_id:
                                    response.razorpay_order_id,

                                razorpay_payment_id:
                                    response.razorpay_payment_id,

                                razorpay_signature:
                                    response.razorpay_signature,
                            });


                        if (!verifyResponse.success) {
                            throw new Error(
                                verifyResponse.message ||
                                    "Payment verification failed"
                            );
                        }


                        // Close checkout modal
                        setCheckoutOpen(false);


                        // Navigate to success page
                        await navigate({
                            to: "/order-success",

                            search: {
                                orderNumber:
                                    verifyResponse
                                        .order
                                        ?.orderNumber ||
                                    data.order.orderNumber,
                            },
                        });
                    } catch (error) {
                        console.error(
                            "Payment verification error:",
                            error
                        );

                        alert(
                            error instanceof Error
                                ? error.message
                                : "Payment verification failed"
                        );
                    } finally {
                        setBuyingNow(false);
                    }
                },


                // --------------------------------------
                // RAZORPAY CLOSED
                // --------------------------------------

                modal: {
                    ondismiss: () => {
                        setBuyingNow(false);
                    },
                },
            };


            // ------------------------------------------
            // OPEN RAZORPAY
            // ------------------------------------------

            const razorpay =
                new window.Razorpay(options);

            razorpay.open();
        } catch (error) {
            console.error(
                "Buy now checkout error:",
                error
            );

            setBuyingNow(false);

            alert(
                error instanceof Error
                    ? error.message
                    : "Unable to start payment"
            );
        }
    };


    // --------------------------------------------------
    // CHECKOUT PRODUCT DATA
    // --------------------------------------------------

    const checkoutVariant =
        product?.variants?.find(
            (variant) =>
                variant.id ===
                buyNowPayload?.variantId
        );


    const checkoutPrice =
        checkoutVariant?.price ??
        product?.price ??
        0;


    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------
    console.log(product)
    return (
        <>
            <ProductShowcase
                product={product}
                loading={loading}
                error={error}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
            />


            {/* -----------------------------------------
                CHECKOUT MODAL
            ------------------------------------------ */}

            {product && buyNowPayload && (
                <CheckoutModal
                    open={checkoutOpen}

                    onClose={() => {
                        if (!buyingNow) {
                            setCheckoutOpen(false);
                            setBuyNowPayload(null);
                        }
                    }}

                    items={[
                        {
                            id: product.id,

                            name: checkoutVariant
                                ? `${product.name} - ${checkoutVariant.label}`
                                : product.name,

                            image:
                                product.images?.[0]?.url ||
                                "",

                            price: checkoutPrice,

                            quantity:
                                buyNowPayload.quantity,
                        },
                    ]}

                    subtotal={
                        checkoutPrice *
                        buyNowPayload.quantity
                    }

                    shipping={0}

                    total={
                        checkoutPrice *
                        buyNowPayload.quantity
                    }

                    onSubmit={handleCheckout}

                    loading={buyingNow}
                />
            )}
        </>
    );
}