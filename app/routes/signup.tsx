import {
  Form,
  Link,
  useSubmit,
  MetaFunction,
  useFetcher,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import stylesHref from "../styles/signup.scss?url";
import defaultHref from "../styles/default.scss?url";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { LinksFunction, json, redirect } from "@remix-run/node";
import mongoose from "mongoose";
import { User } from "../.server/db";
import { getSession, commitSession } from "~/.server/auth";
import { encrypt, decrypt, encryptedText } from "~/.server/security";
import React, { useEffect, useRef, useState } from "react";
import house from "../images/house.png";
import education from "../images/education.png?url";
import debt from "../images/debt.png?url";
import retirement from "../images/retirement.png?url";
import other from "../images/other.png?url";
import travel from "../images/travel.png?url";
import onboardingHref from "../styles/onboarding.scss?url";

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

export async function action({ request }: ActionFunctionArgs) {
  /*
   **                     **
   **  CREATES CONSTANTS  **
   **                     **
   */
  const body = await request.formData();
  console.log("TEST")
  const first = body.get("first_name");
  const last = body.get("last_name");
  const email = body.get("email");
  const dob = body.get("dob")
  const password = body.get("password");
  const confirm_password = body.get("confirm_password");
  console.log(first, last, email, password, confirm_password);
  // DB CONNECTION
  await mongoose.connect(process.env.MONGODB_URL!);
  const session = await getSession(request.headers.get("Cookie"));

  const newUser = new User({
    first: first,
    last: last,
    email: email,
  });
  newUser.setPassword(password);

  newUser.save();

  session.set("userId", newUser._id.toString());
  const cookie = await commitSession(session);
  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": cookie,
    },

  });
}

export const meta: MetaFunction = () => {
  return [
    { title: "Create An Account" },
    { name: "description", content: "Signup for Mar!" },
  ];
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesHref,
    },
    {
      rel: "stylesheet",
      href: defaultHref,
    },
    {
      rel: "stylesheet",
      href: onboardingHref,
    },
  ];
};

export default function Signup() {
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const [currentOnboarding, setCurrentOnboarding] = useState(1);

  // sets errors
  const [firstError, setFirstError] = useState<string | null>(null);
  const [lastsError, setLastError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const onboarding_1 = useRef(null);
  const onboarding_2 = useRef(null);
  const onboarding_3 = useRef(null);
  const onboarding_4 = useRef(null);

  const firstUpdate = useRef<boolean>(true);

  const firstRef = useRef<HTMLInputElement>(null);
  const lastRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

 const proceed = () => {
  if(currentOnboarding == 1) {
    const email = emailRef.current.value || null;
    const first = firstRef.current.value || null;
    const last = lastRef.current.value || null;
    const onboarding_1_approvals = {
      name: false,
      last: false,
      email: false,
    }
    if(first == null) {
      setFirstError("First name is required");
      onboarding_1_approvals.name = false;
      firstRef.current?.classList.add("error")
    } else {
      onboarding_1_approvals.name = true;
      firstRef.current?.classList.remove("error")
    }
    if(last == null) {
      setLastError("Last name is required");
      onboarding_1_approvals.last = false;
      lastRef.current?.classList.add("error")
    } else {
      onboarding_1_approvals.last = true;
      lastRef.current?.classList.remove("error")
    }
    if(email == null) {
      setEmailError("Email is required")
      emailRef.current?.classList.add("error")
      onboarding_1_approvals.email = false
    } else {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if(pattern.test(email)) {
      onboarding_1_approvals.email = true
      emailRef.current?.classList.remove("error")
     } else {
      setEmailError("Email is invalid")
      emailRef.current?.classList.add("error")
     }
    }
    if(onboarding_1_approvals.email == true && onboarding_1_approvals.last == true && onboarding_1_approvals.name == true) {
      setCurrentOnboarding(prev => (prev === 4 ? 1 : prev + 1))
    }
  } else if (currentOnboarding == 2) {
    const dob = dobRef.current.value;
    let flag = false;
    console.log(dob)
    if(dob == null || dob == "") {
      setDobError("DOB is required")
      dobRef.current?.classList.add("error")
    } else {
      const isValidDob = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(dob);
      if(!isValidDob) {
        setDobError("DOB is incorrect")
        dobRef.current?.classList.add("error")
      } else {
        flag = !flag
        setCurrentOnboarding(prev => (prev === 4 ? 1 : prev + 1));
      }
    }
  } else if (currentOnboarding == 3) {
    setCurrentOnboarding(prev => (prev === 4 ? 1 : prev + 1));
  } else {
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    if(password || confirmPassword == null) {
      if (!password && confirmPassword) {
        setPasswordError("Password is required")
        passwordRef.current?.classList.add("error")
      } else if (!confirmPassword && password) {
        setPasswordError("Password is required")
        confirmPasswordRef.current?.classList.add("error")
      } else {
        setPasswordError("Password is required")
        confirmPasswordRef.current?.classList.add("error")
        passwordRef.current?.classList.add("error")
      }
    } else if(password && confirmPassword){
      if(password != confirmPassword) {
        setPasswordError("Passwords must equal");
        confirmPasswordRef.current?.classList.add("error")
        passwordRef.current?.classList.add("error")
      }
    }
  }
 }

 useEffect(() => {
  if(firstUpdate.current) {
    firstUpdate.current = false;
    return;
  } else {
    if(currentOnboarding == 1) {
      // Validate email by checking if it doesnt exist in the database
      onboarding_1.current.classList.remove('hide');
      onboarding_4.current.classList.remove('show');
      onboarding_4.current.classList.add('hide')
      onboarding_1.current.classList.add('show')
    } else if (currentOnboarding == 2) {
      // Validate DOB if it matches the formate mm/dd/yyyy
      onboarding_2.current.classList.remove('hide');
      onboarding_1.current.classList.remove('show');
      onboarding_1.current.classList.add('hide')
      onboarding_2.current.classList.add('show')
    } else if (currentOnboarding == 3) {
      onboarding_3.current.classList.remove('hide');
      onboarding_2.current.classList.remove('show');
      onboarding_2.current.classList.add('hide')
      onboarding_3.current.classList.add('show')
    } else {
      // passwords must match and passwords must be more the 4 characters and have atleast 1 number and 1 special character
      onboarding_4.current.classList.remove('hide');
      onboarding_3.current.classList.remove('show');
      onboarding_3.current.classList.add('hide')
      onboarding_4.current.classList.add('show')
    }
  }
 }, [currentOnboarding])


  return (
    <>
      <div className="sign-up-page">
        <Form
        method="post"
        action="/signup">
        <div id="onboarding-1" className="show" ref={onboarding_1}>
          <div className="title">
            <p>Create your account</p>
          </div>
          <fieldset disabled={navigation.state === "submitting"}>
            <p className="field-names">First Name</p>
            <div className="group">
              <input
                type="text"
                name="first_name"
                placeholder={firstError !== null ? firstError : "Teresa"}
                className="name"
                ref={firstRef}
              />
            </div>
            <p className="field-names">Last Name</p>
            <div className="group">
              <input
                type="text"
                name="last_name"
                placeholder={lastsError !== null ? lastsError : "Chavez"}
                className="name"
                ref={lastRef}
              />
            </div>

            <div className="group">
              <p className="field-names">Email</p>
              <input
                type="email"
                id="email_input"
                name="email"
                placeholder={emailError !== null ? emailError : "chavezt2@yahoo.com"}
                className="email"
                ref={emailRef}
              />
              {actionData?.errors?.email ? (
                <em>{actionData?.errors.email}</em>
              ) : null}
            </div>
            <div className="button-container">
              <div
                className="button color-1 adjust_width_by_10"
                onClick={proceed}
              >
                Next
              </div>
            </div>
            <div className="container-message">
              <div className="have-an-account">Have an account? </div>
            </div>
          </fieldset>
          <Link to="/login">
            <div className="button-container">
              <button className="button color-2">Sign In</button>
            </div>
          </Link>
          <p className="terms-policy">
            By signing up, you agree to our <a href="#">Terms</a> and{" "}
            <a href="#">Privacy Policy</a>
          </p>
        </div>
        <div id="onboarding-2" className="hide" ref={onboarding_2}>
          <div id="container-responsive">
            <div id="container">
              <div className="title">
                <p>When were you born?</p>
              </div>
              <p className="field-names">Date of Birth</p>
              <div className="group">
                <input
                  type="text"
                  name="dob"
                  placeholder={dobError !== null ? dobError : "mm/dd/yyyy"}
                  className="name"
                  ref={dobRef}
                />
              </div>
              <div className="button-container">
              <div className="button color-1 adjust_width_by_10" onClick={proceed}>Next</div>
              </div>
            </div>
          </div>
        </div>
        <div id="onboarding-3" className="hide" ref={onboarding_3}>
          <div id="container-responsive">
              <div className="container-onboarding-3">
              <div className="title">
                <p>What is most important to you?</p>
              </div>
                <fieldset className="buttons-onboarding-3">
                  <label className="button-onboarding-3">
                    <input type="radio" name="priority" value="travel" />
                    <img
                      src={travel}
                      alt="Travel Image"
                      className="button-image"
                    />
                    <div className="button-text">Travel</div>
                  </label>
                  <label className="button-onboarding-3">
                    <input type="radio" name="priority" value="debt" />
                    <img
                      src={debt}
                      alt="Pay Off Debt Image"
                      className="button-image"
                    />
                    <div className="button-text">Pay Off Debt</div>
                  </label>
                  <label className="button-onboarding-3">
                    <input type="radio" name="priority" value="house" />
                    <img
                      src={house}
                      alt="Buy a House Image"
                      className="button-image"
                    />
                    <div className="button-text">Buy a House</div>
                  </label>
                  <label className="button-onboarding-3">
                    <input type="radio" name="priority" value="retirement" />
                    <img
                      src={retirement}
                      alt="Save for Retirement Image"
                      className="button-image"
                    />
                    <div className="button-text">Save for Retirement</div>
                  </label>
                  <label className="button-onboarding-3">
                    <input type="radio" name="priority" value="education" />
                    <img
                      src={education}
                      alt="Education Image"
                      className="button-image"
                    />
                    <div className="button-text">Education</div>
                  </label>
                  <label className="button-onboarding-3 ">
                    <input type="radio" name="priority" value="other" />
                    <img
                      src={other}
                      alt="Other Image"
                      className="button-image"
                    />
                    <div className="button-text">Others</div>
                  </label>
                </fieldset>
                <div className="button-container">
                <div className="button color-1" onClick={proceed}>Next</div>
                </div>
              </div>
          </div>
        </div>
        <div id="onboarding-4" className="hide" ref={onboarding_4}>
          <div id="container-responsive">
            <div id="container">
              <div className="title">
                <p>Choose a Password</p>
              </div>
              <div className="group">
                <p className="field-names">Password</p>
                <input
                  type="password"
                  placeholder={passwordError != null ? passwordError : "**********"}
                  className="password"
                  name="password"
                  ref={passwordRef}
                />
                {actionData?.errors?.password ? (
                  <em>{actionData?.errors.password}</em>
                ) : null}
              </div>
              <div className="group">
                <p className="field-names">Confirm Password</p>
                <input
                  type="password"
                  placeholder={passwordError != null ? passwordError : "**********"}
                  name="confirm_password"
                  className="confirm-password"
                  ref={passwordRef}
                />
                {actionData?.errors?.password ? (
                  <em>{actionData?.errors.password}</em>
                ) : null}
              </div>
              <div className="button-container">
                <button type="submit" className="button color-1">Continue</button>
              </div>
            </div>
          </div>
        </div>
        </Form>
      </div>
    </>
  );
}
