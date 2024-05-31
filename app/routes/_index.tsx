import type { LinksFunction } from "@remix-run/node";
import logo_url from "/mar_logo.png?url";
import { Link, MetaFunction, json, redirect } from "@remix-run/react";
import stylesHref from "../styles/homepage.scss?url";
import defaultHref from "../styles/default.scss?url";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSession, commitSession } from "~/.server/auth";

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
      rel: "preload",
      href: logo_url,
      as: "image",
    },
  ];
};

export const meta: MetaFunction = () => {
  return [
    { title: "Mar | A Pretty Minimalist Budget Tracker" },
    {
      name: "description",
      content:
        "Mar is the premier tool for managing business and personal income and expenses!",
    },
    { name: "theme-color", content: "#4868CB" },
  ];
};

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

export default function Index() {
  return (
    <>
      <div id="container-homepage">
        <div className="interactive-container" id="landing-page">
          <div id="greeting-container">
            <div id="circle-statement">
              <div id="oval">
                <p>Become Financially Stable Today.</p>
              </div>
            </div>
          </div>
          <div id="company-slogan">
            <div id="slogan-container-grid">
              <div>
                Save more by <p id="slogan_bold">spending smarter</p> with{" "}
                <img src={logo_url} />
              </div>
            </div>
          </div>
          <div id="buttons-container">
            <Link to="/login" reloadDocument>
              <div className="button-container">
                <div id="login" className="button adjust_width_by_10">
                  <p>Login</p>
                </div>
              </div>
            </Link>
            <Link to="/signup" reloadDocument>
              <div className="button-container">
                <div id="signup" className="button adjust_width_by_10">
                  <p>Create an Account</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
