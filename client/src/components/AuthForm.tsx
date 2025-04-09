"use client"

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { FIELD_NAMES, FIELD_TYPES } from "../constant";
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { Input } from "./ui/input";
import { ZodType } from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { FcGoogle } from "react-icons/fc";
import { RiAppleFill } from "react-icons/ri";
import { RememberPassword } from "./RememberPassword";

import Forgot from "../assets/auth/forgot-pw.png";

type FormType = "SIGN_IN" | "SIGN_UP" | "FORGOT_PW";

interface AuthFormProps<T extends FieldValues> {
    schema: ZodType<T>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
    type: FormType;
}

const AuthForm = <T extends FieldValues>({
    type,
    schema,
    defaultValues,
    onSubmit
}: AuthFormProps<T>) => {
    const [showPassword, setShowPassword] = useState(false);
    const isSignIn = type === "SIGN_IN";

    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    });

    const handleSubmit: SubmitHandler<T> = async (data) => {
        const result = await onSubmit(data);
    };

    return (
        <div className="flex flex-col gap-6 px-8 max-w-lg">
            <h1 className="text-3xl font-semibold text-brand-1 text-center">
                {type === "SIGN_IN" ? "Welcome back" : type === "SIGN_UP" ? "Create an Account" : "Forgot Password"}
            </h1>
            <p className="text-sm text-center text-brand-1 -mt-3">
                {type === "SIGN_IN"
                    ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
                    : type === "SIGN_UP" ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
                    : "To reset your password, you need your email or mobile number that can be authenticated"
                }
            </p>
            {type === "FORGOT_PW"  && (
                <div className="flex justify-center my-3">
                    <img 
                        src={Forgot} 
                        alt="Forgot Password Illustration" 
                        className=" object-contain"
                    />
                </div>
            )}
            {/* {(type === "FORGOT_PW" || type === "SIGN_UP") && (
                <div className="flex justify-center">
                    <img 
                        src={type === "FORGOT_PW" ? "/forgot-password.svg" : "/signup.svg"} 
                        alt={type === "FORGOT_PW" ? "Forgot Password Illustration" : "Sign Up Illustration"} 
                        className="w-48 h-48 object-contain"
                    />
                </div>
            )} */}

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-5"
                >
                    {Object.keys(defaultValues).map((fieldName) => (
                        <FormField
                            key={fieldName}
                            control={form.control}
                            name={fieldName as Path<T>}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-brand-1">
                                        {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                required
                                                type={
                                                    field.name === "password" 
                                                        ? showPassword ? "text" : "password"
                                                        : FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                                                }
                                                placeholder={FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                                                className="form-input bg-white ring-border-none pr-10"
                                                {...field}
                                            />
                                            {field.name === "password" && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-brand-3"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                    ))}
                    <div className="flex justify-between items-center -mt-3">
                        {(type === "SIGN_IN" || type === "SIGN_UP") && <RememberPassword />}
                        {isSignIn && (
                            <Button asChild variant="link">
                                <Link to="/forgot-password" className="text-brand-2 font-bold">
                                    Forgot password?
                                </Link>
                            </Button>
                        )}
                    </div>
                    <Button type="submit" className="bg-brand-1 hover:bg-brand-1/85 uppercase tracking-widest w-full">
                        {type === "SIGN_IN" ? "Login" : type === "SIGN_UP" ? "Sign Up" : "Reset Password"}
                    </Button>
                    {type === "FORGOT_PW" && (
                        <Button asChild className="bg-brand-3 hover:bg-brand-3/85 uppercase tracking-widest w-full">
                            <Link to="/signin">BACK TO LOGIN</Link>
                        </Button>
                    )}
                </form>
            </Form>

            <div>
                {(type === "SIGN_IN" || type === "SIGN_UP") && <div className="space-y-5 flex flex-col justify-center ">
                    <div className="flex justify-center items-center gap-4 mx-9">
                        <hr className="flex-grow border-t border-gray-300" />
                        <span className="text-gray-500 text-sm">Or Continue with</span>
                        <hr className="flex-grow border-t border-gray-300" />
                    </div>

                    <div className="flex space-x-4 justify-center">
                        <Button variant="outline" size="icon" className="border-brand-border">
                            <FcGoogle />
                        </Button>
                        <Button variant="outline" size="icon" className="border-brand-border">
                            <RiAppleFill />
                        </Button>
                    </div>
                </div>
                }

                {(type === "SIGN_IN" || type === "SIGN_UP") && (
                    <p className="text-center text-sm mt-3">
                        {isSignIn ? "Don't have an account? " : "Already have an account? "}

                        <Link
                            to={isSignIn ? "/signup" : "/signin"}
                            className="text-brand-2 underline hover:no-underline"
                        >
                            {isSignIn ? "Sign up" : "Sign in"}
                        </Link>
                    </p>
                )}

            </div>
        </div>
    )
}

export default AuthForm