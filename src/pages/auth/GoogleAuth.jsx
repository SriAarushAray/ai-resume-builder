import { useState } from "react";

function GoogleAuth() {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSelectAccount = () => {
    setIsVerifying(true);
    setTimeout(() => {
      if (window.opener) {
        window.opener.postMessage({
          type: "OAUTH_SUCCESS",
          user: {
            name: "Sri Aarush Aray",
            email: "aarush.aray@gmail.com",
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aarush"
          }
        }, window.location.origin);
      }
      window.close();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-[#1f1f1f] font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] bg-white border border-[#dadce0] rounded-lg p-10 shadow-sm flex flex-col items-center">
        {/* Google Logo */}
        <svg className="w-12 h-12 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>

        {isVerifying ? (
          <div className="flex flex-col items-center justify-center my-12 space-y-4">
            {/* Google Material Spinner */}
            <div className="w-10 h-10 border-4 border-[#1a73e8] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 font-medium animate-pulse">Signing you in...</p>
          </div>
        ) : (
          <div className="w-full text-center">
            <h1 className="text-2xl font-normal text-[#202124] mb-1">Sign in with Google</h1>
            <p className="text-sm text-[#5f6368] mb-8">to continue to <span className="font-semibold text-sky-600">Resumiq</span></p>

            {/* Account Card List */}
            <div className="w-full border-t border-[#dadce0] text-left">
              
              {/* Account Item */}
              <button 
                onClick={handleSelectAccount}
                className="w-full py-4 border-b border-[#dadce0] flex items-center gap-3 hover:bg-[#f7f9fa] transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-sky-100 border border-slate-200 flex items-center justify-center font-bold text-sky-800 text-sm">
                  SA
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#3c4043] truncate">Sri Aarush Aray</p>
                  <p className="text-xs text-[#5f6368] truncate">aarush.aray@gmail.com</p>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded border border-emerald-500/20">Active</span>
              </button>

              {/* Mock Use Another Account */}
              <button 
                onClick={handleSelectAccount}
                className="w-full py-4 border-b border-[#dadce0] flex items-center gap-3 hover:bg-[#f7f9fa] transition-colors text-slate-600 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full border border-[#dadce0] flex items-center justify-center text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Use another account</span>
              </button>

            </div>

            <p className="text-xs text-slate-400 leading-relaxed mt-8 text-left">
              To continue, Google will share your name, email address, language preference, and profile picture with Resumiq.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoogleAuth;
