const styles = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }) {
    return (
        <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${styles[status] || "bg-bg2 text-muted"}`}>
            {status}
        </span>
    );
}