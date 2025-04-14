export default function LoadingScreen() {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex-col">
            <div className="relative">
                <div className="inset-0 flex items-center justify-center font-bold text-lg">
                    <img src="/vibe_chats.ico" alt="Logo" className="w-20 h-20 mb-4 animate-bounce" />
                </div>
            </div>
            <p className="mt-6 text-xl font-semibold animate-pulse">Brewing your vibe ☕️...</p>
        </div>
    );
}