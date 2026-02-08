export default function Test() {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`);
    return <div>TEST</div>;
}
