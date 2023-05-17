export default function ProgressBar({ progress }: { progress: number }) {
    return (
        <div className="rounded h-2 w-full bg-gray-100">
            <div
                style={{ width: `${progress}%` }}
                className="rounded h-2 bg-indigo-500"
            ></div>
        </div>
    );
}
