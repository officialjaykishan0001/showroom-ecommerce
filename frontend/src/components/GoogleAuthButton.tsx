
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "@tanstack/react-router";
import { googleLoginUser } from "@/lib/auth";
import { useAuthStore } from "@/stores/authStore";

export default function GoogleAuthButton({ onError }: { onError?: (m: string) => void }) {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  return (
    <div className="flex w-full justify-center">
      <GoogleLogin
        text="continue_with"
        size="large"
        width="400"
        onSuccess={async (res) => {
          try {
            if (!res.credential) throw new Error("No credential from Google");
            const data = await googleLoginUser(res.credential);
            setUser(data.user);
            navigate({ to: data.user.role === "admin" ? "/admin/dashboard" : "/" });
          } catch (e: any) {
            onError?.(e?.response?.data?.message || e?.message || "Google sign-in failed.");
          }
        }}
        onError={() => onError?.("Google sign-in was cancelled or failed.")}
      />
    </div>
  );
}