export default function Skeleton() {
    return (
        <div
            className="min-h-screen w-full flex items-center justify-center px-4 py-8 overflow-hidden"
            style={{
                background:
                    "linear-gradient(to top, rgb(11,39,83), rgb(14,49,105), rgb(19,64,138))",
            }}
        >
            <div className="w-full max-w-[900px] animate-pulse space-y-6">
                <div className="hidden lg:block h-[600px] bg-white rounded-[20px] border border-gray-200 overflow-hidden">
                    <div className="flex h-full">
                        <div className="w-[400px] bg-[#f5f5f5] p-8">
                            <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
                            <div className="h-56 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex-1 p-10">
                            <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
                            <div className="space-y-4">
                                <div className="h-12 bg-gray-200 rounded"></div>
                                <div className="h-12 bg-gray-200 rounded"></div>
                                <div className="h-12 bg-gray-200 rounded"></div>
                                <div className="h-12 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile skeleton */}
                <div className="lg:hidden bg-white rounded-[20px] w-[330px] h-[500px] p-[25px] border border-gray-200 mx-auto">
                    <div className="h-8 w-40 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-4">
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
