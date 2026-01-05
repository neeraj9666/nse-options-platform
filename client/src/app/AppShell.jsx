export default function AppShell({ header, footer, children }) {
    return (
        <div className="h-screen flex flex-col bg-neutral-950 text-neutral-100">
            {/* Header */}
            <div className="flex-none border-b border-neutral-800">
                {header}
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-hidden">
                {children}
            </div>

            {/* Footer */}
            <div className="flex-none border-t border-neutral-800">
                {footer}
            </div>
        </div>
    );
}
