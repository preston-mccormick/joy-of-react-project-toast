import React from "react";

function useKeys({ keys, callback, enabled = true }) {
  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    //console.log("useKeys", { keys, callback, enabled });

    function handleKeyDown(event) {
      if (keys.includes(event.key)) {
        callback();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keys, callback, enabled]);
}

export default useKeys;
