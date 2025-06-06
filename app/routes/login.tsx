import { type ActionFunctionArgs, data as json } from "@remix-run/node";
import { useActionData, useNavigation } from "@remix-run/react";
import { LoginForm } from "~/components/auth/login-form";
import { authenticateUser } from "~/services/auth.server";
import { createUserSession } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/notes";

  // Validate form data
  if (!email || !password) {
    return json(
      {
        errors: {
          email: ["Email is required"],
          password: ["Password is required"],
        },
      },
      { status: 400 }
    );
  }

  try {
    // Authenticate user
    const user = await authenticateUser(email, password);
    if (!user) {
      return json(
        {
          errors: {
            email: ["Invalid email or password"],
          },
        },
        { status: 401 }
      );
    }

    // Create session
    return createUserSession(user.id.toString(), redirectTo);
  } catch (error) {
    console.error("Login error:", error);
    return json(
      {
        errors: {
          email: ["An error occurred during login"],
        },
      },
      { status: 500 }
    );
  }
}

export default function LoginPage() {
  const actionData = useActionData<{
    errors?: { email?: string[]; password?: string[] };
  }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <LoginForm
      errors={actionData?.errors}
      isSubmitting={isSubmitting}
      redirectTo="/notes"
    />
  );
}
