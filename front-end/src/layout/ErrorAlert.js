import React from "react";
import "./Layout.css"
/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an instance of an object with `.message` property as a string, typically an Error instance.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function ErrorAlert({ error }) {
  if(!error){
    return null}
  else {
    return (
      error && (
        <div className="error alert alert-danger m-2">Error: {error.message}</div>
        )
      )
  }
}



export default ErrorAlert;
