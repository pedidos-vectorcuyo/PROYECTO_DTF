import { useGoogleLogin } from '@react-oauth/google';

/**
 * Componente aislado para el login con Google.
 * useGoogleLogin solo se llama cuando este componente se monta,
 * lo que garantiza que siempre exista un GoogleOAuthProvider padre.
 */
const GoogleLoginButton = ({ onSuccess, onError, disabled }) => {
    const handleGoogleLogin = useGoogleLogin({
        onSuccess,
        onError,
    });

    return (
        <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={disabled}
            className="w-full flex items-center justify-center gap-3 h-[44px] bg-surface border border-gray-border rounded-lg px-4 text-[14px] font-medium text-text-main hover:bg-muted transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
            <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.09-6.09C34.46 3.14 29.5 1 24 1 14.82 1 6.98 6.49 3.37 14.29l7.14 5.55C12.24 13.65 17.67 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.1 24.55c0-1.64-.15-3.21-.42-4.73H24v8.96h12.42c-.54 2.9-2.16 5.36-4.6 7.02l7.14 5.55C43.23 37.43 46.1 31.38 46.1 24.55z" />
                <path fill="#FBBC05" d="M10.51 28.16A14.5 14.5 0 0 1 9.5 24c0-1.44.24-2.84.64-4.16L3 14.29A23.5 23.5 0 0 0 .5 24c0 3.77.88 7.34 2.5 10.49l7.51-6.33z" />
                <path fill="#34A853" d="M24 46.5c5.5 0 10.12-1.82 13.49-4.94l-7.14-5.55c-1.98 1.33-4.52 2.12-7.35 2.12-6.33 0-11.76-4.15-13.49-9.84l-7.14 5.55C6.98 41.51 14.82 46.5 24 46.5z" />
            </svg>
            Continuar con Google
        </button>
    );
};

export default GoogleLoginButton;
