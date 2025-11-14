export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-6">
            <h1 className="text-4xl font-bold mb-6 text-primary-text">Login</h1>
            <form className="flex flex-col gap-4 w-80">
                <input type="text" placeholder="Username" className="input input-bordered" />
                <button type="submit" className="btn bg-main text-white rounded-md px-8 py-2">Login</button>
            </form>
            <div className="text-secondary-text font-300">Don&apos;t have an account?<a href="/signup" className="text-main font-bold">Signup</a></div>
        </div>
    )
}