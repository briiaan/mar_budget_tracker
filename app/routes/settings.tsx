import React, { useState } from "react";
import logo_url from "/mar_logo.png?url";
import { Link, Form, MetaFunction } from "@remix-run/react";
import { ExternalScriptsHandle } from "remix-utils/external-scripts";
import stylesHref from "../styles/settings.scss?url";
import { LinksFunction } from "@remix-run/node";

export let handle: ExternalScriptsHandle = {
  scripts: [
    {
      src: "https://kit.fontawesome.com/6dcd091ab4.js",
      crossOrigin: "anonymous",
    },
  ],
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesHref,
    },
    {
      rel: "prefetch",
      href: logo_url,
      as: "image",
    },
  ];
};

export const meta: MetaFunction = () => {
  return [
    { title: "Settings" },
    { name: "description", content: "Update your settings!" },
  ];
};

export default function Login() {
  return (
    <>
      <div className="container">
        <h1 className="title">Settings</h1>
        <h2 className="box-title">User Profile</h2>
        <div className="settings-box">
          <div className="settings-content">
            <div className="setting-item">
              <label> Change Username & Password</label>
              <a href="#" className="arrow-icon">
                <i aria-hidden className="fas fa-chevron-right"></i>
              </a>
            </div>
            <div className="setting-item">
              <label>Email Address</label>
              <a href="#" className="arrow-icon">
                <i aria-hidden className="fas fa-chevron-right"></i>
              </a>
            </div>
            <div className="setting-item">
              <label>View Account History</label>
              <a href="#" className="arrow-icon">
                <i aria-hidden className="fas fa-chevron-right"></i>
              </a>
            </div>
            <div className="setting-item">
              <label>Saved login</label>
              <a href="#" className="arrow-icon">
                <i aria-hidden className="fas fa-chevron-right"></i>
              </a>
            </div>
          </div>
        </div>
        <h1 className="box-title">Connected experiences</h1>
        <div className="settings-box">
          <div className="settings-content">
            <div className="setting-item">
              <label>Sharing across profiles</label>
              <a href=".html">
                <i className="fa fa-chevron-right"></i>
              </a>
            </div>
            <div className="setting-item">
              <label>Logging in with accounts</label>
              <a href=".html">
                <i className="fa fa-chevron-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
