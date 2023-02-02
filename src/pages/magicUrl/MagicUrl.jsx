import React, { useEffect } from "react";
import { magicURLLoginCallback } from "../../config/appwrite-config";

export default function MagicUrl() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    const magicURLsecret = urlParams.get("secret");
    const promise = magicURLLoginCallback(userId, magicURLsecret);
    promise.then(
      function (response) {
        console.log(response); // Success
        window.location.href = "/";
      },
      function (error) {
        console.log(error); // Failure
        window.location.href = "/login?error=failure";
      }
    );
  }, []);
  return <div>MagicUrl</div>;
}
