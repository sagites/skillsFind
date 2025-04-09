import { forgotPwSchema } from "@/lib/validations"
import AuthForm from "./AuthForm"

const ForgotPassword = () => {
    return (
        <AuthForm
          type="FORGOT_PW"
          schema={forgotPwSchema}
          defaultValues={{
            email: "",
          }}
          onSubmit={() => { }}
    
        />
      )
}

export default ForgotPassword