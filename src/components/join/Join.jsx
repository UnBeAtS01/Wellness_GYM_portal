import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

import "./Join.css";

const Join = () => {
    const form = useRef();
    const forms = useRef();
    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                "service_qwo92t4",
                "template_hu671y3",
                form.current,
                "R_DQ0wEEOOo1UuPjb",
            )
            .then(
                (result) => {
                    console.log(result.text);
                },
                (error) => {
                    console.log(error.text);
                },
            );
    };
    const [recipients, setRecipients] = useState("");

    const sendEmailToReciept = (e) => {
        e.preventDefault();

        // Split recipients by comma and trim whitespace
        const recipientList = recipients
            .split(",")
            .map((email) => email.trim());

        // Send emails to each recipient
        recipientList.forEach((toEmail) => {
            emailjs
                .send(
                    "service_qwo92t4", // Replace with your EmailJS service ID
                    "template_qb3ifv2", // Replace with your EmailJS template ID
                    {
                        to_email: toEmail, // Pass the recipient's email
                        message: forms.current.message.value, // Form message value
                    },
                    "R_DQ0wEEOOo1UuPjb", // Replace with your EmailJS public key
                )
                .then(
                    (result) => {
                        console.log(`Email sent to ${toEmail}:`, result.text);
                    },
                    (error) => {
                        console.error(
                            `Error sending email to ${toEmail}:`,
                            error.text,
                        );
                    },
                );
        });

        alert("Emails sent!");
    };

    return (
        <div className="Join" id="join-us">
            <div className="left-j">
                <hr />
                <div>
                    <span className="stroke-text">READY TO</span>
                    <span>LEVEL UP</span>
                </div>
                <div>
                    <span>YOUR BODY</span>
                    <span className="stroke-text">WITH US?</span>
                </div>
            </div>
            <div className="right-j">
                <form
                    ref={forms}
                    className="email-container"
                    onSubmit={sendEmailToReciept}
                >
                    <input
                        type="text"
                        name="message"
                        placeholder="Enter your message"
                        required
                    ></input>
                    <input
                        type="text"
                        value={recipients}
                        onChange={(e) => setRecipients(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    <button className="btn btn-j">Send Emails</button>
                </form>
            </div>
        </div>
    );
};

export default Join;
