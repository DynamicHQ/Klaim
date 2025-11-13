import {handleSignup} from '@/utils/signup'

export default function Signup() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-6">
            <h1 className="text-4xl font-bold mb-6 text-primary-text">Signup</h1>
            <form className="flex flex-col gap-4 w-80">
                <button onClick={handleSignup} type="submit" className="btn bg-main text-white rounded-md px-8 py-2">Connect Wallet</button>
            </form>
            <div className="text-secondary-text font-300">Already have an account?<a href="/login" className="text-main font-bold">Login</a></div>
        </div>
    )
}