import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

const SendButton = ({ handleSend, message }) => {
    const [status, setStatus] = useState("idle");

    const handleSendMessage = () => {
        if (!message.trim() || status !== "idle") return;

        setStatus("flying");
        handleSend();

        setTimeout(() => {
            setStatus("returning");
        }, 200);

        setTimeout(() => {
            setStatus("idle");
        }, 600);
    };

    let motionProps = {};

    if (status === "flying") {
        motionProps = {
            initial: { x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 },
            animate: {
                x: 40,
                y: -40,
                opacity: 0,
                rotate: 45,
                scale: 1.2,
            },
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
                duration: 0.3,
            },
        };
    } else if (status === "returning") {
        motionProps = {
            initial: { x: -30, y: 30, opacity: 0, scale: 0.5, rotate: -45 },
            animate: { x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 },
            transition: {
                stiffness: 120,
                damping: 10,
                duration: 0.2,
            },
        };
    } else {
        motionProps = {
            initial: false,
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0 },
        };
    }

    return (
        <Button
            type="button"
            size="icon"
            className="rounded-full relative overflow-hidden"
            disabled={!message.trim() || status === "flying"}
            onClick={handleSendMessage}
        >
            <div className="flex items-center justify-center h-full w-full">
                <motion.div {...motionProps} key={status}>
                    <Send className="h-5 w-5" />
                </motion.div>
            </div>
        </Button>
    );
};

export default SendButton;
