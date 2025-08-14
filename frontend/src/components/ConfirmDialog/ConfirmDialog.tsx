import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import style from "./ConfirmDialog.module.css";

const useConfirm = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [message, setMessage] = useState("");

    const [resolverFunction, setResolverFunction] = useState<
        ((value: boolean) => void) | null
    >(null);

    const getConfirmation = async (msg: string) => {
        setShowDialog(true);
        setMessage(msg);
        //this is taking the React created resolve function
        // (which is a function called to resolve/end the promise)
        //and it is storing it in our "resolverFunction" variable
        //so we can call it when Cancel or Ok is clicked
        return new Promise<boolean>((resolvePromiseFn) => {
            //have to save the function as (() => resolvePromiseFunction),
            //otherwise, React would try to execute the function if you just stored
            //it like 'setResolverFunction(resolvePromiseFn)
            setResolverFunction(() => resolvePromiseFn);
        });
    };

    const onClick = async (status: boolean) => {
        setShowDialog(false);
        if (resolverFunction) {
            resolverFunction(status);
        }
    };

    const ConfirmDialog: React.FC = () => (
        <Modal show={showDialog} centered>
            <Modal.Header>
                <Modal.Title>Confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer className={style.questionModal__footer}>
                <Button
                    className={style.questionModal__glowButton}
                    variant="light"
                    onClick={() => onClick(false)}
                >
                    Cancel
                </Button>
                <Button
                    className={style.questionModal__glowButton}
                    variant="light"
                    onClick={() => onClick(true)}
                >
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    );
    return [getConfirmation, ConfirmDialog] as const;
};

export default useConfirm;
