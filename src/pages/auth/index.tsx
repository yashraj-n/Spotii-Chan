import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { reauth } from "../../lib/api";

function Auth() {
  const [secret, setsecret] = useState("");
  const [id, setid] = useState("");

  const router = useRouter();

  const authenticate = async () => {
    const res = await reauth(id, secret);
    if (res === "OK") {
      router.push("/app");
    } else {
      alert("Invalid Credentials");
    }
  };
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css"
        />
      </Head>
      <div>
        <div className="cont">
          <div>
            <iframe
              src="https://app.tango.us/app/embed/f41bc6b8-b3d3-4be7-809b-12239b0451b5?iframe"
              sandbox="allow-scripts allow-top-navigation-by-user-activation allow-popups allow-same-origin"
              security="restricted"
              title="Tango Workflow"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen={true}
            />
          </div>
          <div className="is-centered">
            <div className="box has-background-dark has-text-light ">
              <div className="field">
                <label className="label has-text-light">Client ID</label>
                <div className="control">
                  <input
                    className="input"
                    onChange={(e) => {
                      setid(e.target.value);
                    }}
                    placeholder="Client ID"
                    id="id"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label has-text-light">Client Secret</label>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    id="secret"
                    placeholder="********************"
                    onChange={(e) => {
                      setsecret(e.target.value);
                    }}
                  />
                </div>
              </div>
              <h3>
                Spotii-Chan uses{" "}
                <a href="https://invidious.io/" target={"_blank"}>
                  Invidious
                </a>{" "}
                to get YouTube Video Details
              </h3>
              <button className="button is-primary" onClick={authenticate}>
                Authenticate
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;
