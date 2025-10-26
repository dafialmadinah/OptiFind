import Image from "next/image";
import Link from "next/link";

interface BannerCardProps {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    backgroundImage: string;
    variant: "blue" | "orange";
}

export function BannerCard({
    title,
    subtitle,
    buttonText,
    buttonLink,
    backgroundImage,
    variant,
}: BannerCardProps) {
    const bgColor =
        variant === "blue"
            ? "from-[#2563eb] to-[#3b82f6]"
            : "from-[#f97316] to-[#fb923c]";
    const buttonColor =
        variant === "blue"
            ? "bg-[#f97316] hover:bg-[#ea580c]"
            : "bg-[#1e3a8a] hover:bg-[#1e40af]";

    return (
        <Link href={buttonLink}>
            <div className="relative rounded-2xl overflow-hidden isolate hover:shadow-2xl transition-all duration-300 cursor-pointer group h-64 sm:h-72 lg:h-80">
                {/* Background Gradient */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${bgColor} scale-[1.02]`}
                />

                {/* Background Image */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <Image
                        src={backgroundImage}
                        alt={title}
                        fill
                        sizes="100vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 will-change-transform translate-z-0 scale-[1.01]"
                        priority
                    />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 sm:p-8 lg:p-10 flex flex-col justify-center z-10">
                    <div className="max-w-[180px] sm:max-w-[220px] lg:max-w-[260px]">
                        <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight drop-shadow-lg">
                            {title}
                        </h2>
                        <p className="text-white text-sm sm:text-base lg:text-lg mb-6 leading-relaxed drop-shadow-md">
                            {subtitle}
                        </p>
                        <button
                            className={`${buttonColor} text-white px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
