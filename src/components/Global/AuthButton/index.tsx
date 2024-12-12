import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, SignedOut } from "@clerk/clerk-react"

const AuthButton = () => {
    return (
        <SignedOut>
            <div className="flex gap-x-3 h-screen justify-center items-center ">
              <SignInButton>
                <Button variant={"outline"} className="px-10 rounded-full hover:bg-gray-200">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button variant="outline" className="px-10 rounded-full">
                    Sign up
                </Button>
              </SignUpButton>
            </div>
        </SignedOut>
    )
}

export default AuthButton