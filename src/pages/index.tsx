import { useEffect } from "react";
import { init } from "../lib/api";
import { useRouter } from "next/router";

function App() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      if (router.isReady) {
        // Checks if user is logged in or not,
        // if logged in then redirects to /app
        // else redirects to /auth
        
        const isOK = await init();
        if (isOK === "OK") {
          router.push("/app");
        } else {
          router.push("/auth");
        }
      }
    })();
  }, [router.isReady]);

  //Checking If User is Logged in or not
  return <>Initiliazing...</>;
}

export default App;
