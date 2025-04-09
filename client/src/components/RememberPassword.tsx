import { Checkbox } from "@/components/ui/checkbox"

export function RememberPassword() {
    return (
        <div className="flex items-center space-x-2 ">
            <Checkbox id="remember-pw" className="border border-red shadow-none bg-brand-1/5" />
            <div className="grid gap-1.5 leading-none">
                <label
                    htmlFor="remember-pw"
                    className="text-brand-3 text-sm font- leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Remember me
                </label>
            </div>
        </div>
    )
}
