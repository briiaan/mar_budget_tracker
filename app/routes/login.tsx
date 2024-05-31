import React, { useState } from "react";
import logo_url from "/mar_logo.png?url";
import { Link, Form, MetaFunction, useActionData, useNavigation } from "@remix-run/react";
import stylesHref from "../styles/login.scss?url";
import defaultHref from "../styles/default.scss?url"
import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import mongoose from "mongoose";
import { User } from "~/.server/db";
import { commitSession, getSession } from "~/.server/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) {
    return redirect("/dashboard");
  }

  const data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesHref,
    },
    {
      rel: "stylesheet",
      href: defaultHref
    },
    {
      rel: "preload",
      href: logo_url,
      as: "image",
    },
  ];
};

export const meta: MetaFunction = () => {
  return [
    { title: "Login" },
    { name: "description", content: "Login to Mar!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const email = body.get("email");
  const password = body.get("password");
  console.log(email, password)
  const incorrect = "Email or Password is incorrect"
  // Establishes a connection to DB
  await mongoose.connect(process.env.MONGODB_URL!);

  const user = await User.findOne({email: email});
  const errors: { [key: string]: string | null } = {};
  if(user == null) {
    errors.email = incorrect
    return json({ errors });
  } else {
    const valid = user.validPassword(password)
    if(!valid) {
      errors.email = incorrect
      return json({ errors })
    }
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", user._id.toString());
    const cookie = await commitSession(session);
    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": cookie,
      }
    });
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  return (
    <>
    <div id="login-root">
      <div className="container">
        <div>
          <div className="logo">
            <img src={logo_url} alt="Logo" />
            <div className="title">
            <p style={{
              'paddingTop': '10px'
            }}>Sign in</p>
          </div>
          </div>
          <Form action="/login" method="post">
            <div className="group">
              <p>Email</p>
              <input
                type="email"
                id="username"
                placeholder="Enter your email"
                name="email"
              />
            </div>
            <div className="group">
              <p>Password</p>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                name="password"
              />
            </div>
            <div>
              <div className="button-container">
            <button type="submit" className="button color-1">
            {navigation.state === "submitting" ? "Submitting..." : "Sign in"}
            </button>
            </div>
            {actionData?.errors?.email ? (
                <p className="error-log">{actionData?.errors.email}</p>
              ) : null}
            </div>

          </Form>
          <div className="signup-link">
            <div className="container-message">
            <p>Don't have an account?</p>
            </div>
            <Link to="/signup" reloadDocument>
              <div className="button-container">
              <button type="button" className="button">
                Sign Up
              </button>
              </div>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
