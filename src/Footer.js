import React from "react";

const Footer = () => {
    const now = new Date().getFullYear()
    return(
        <div className="footer">
            <span>©{ now } Ron Kosova</span>
        </div>
    );
}

export default Footer;