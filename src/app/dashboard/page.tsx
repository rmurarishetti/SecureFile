// app/dashboard/page.tsx
import FileUpload from "../components/dashboard/FileUpload";

export default function DashboardPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">File Scanner</h1>
                <p className="mt-1 text-gray-400">
                    Upload files to scan them for potential security threats.
                </p>
            </div>

            <div className="mt-6">
                <FileUpload />
            </div>

            {/* Quick Stats Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Files Scanned', value: '0' },
                    { label: 'Threats Detected', value: '0' },
                    { label: 'Last Scan', value: 'Never' }
                ].map((stat, index) => (
                    <div
                        key={index}
                        className="bg-black/50 backdrop-blur-md p-6 rounded-lg border border-gray-800"
                    >
                        <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                        <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}