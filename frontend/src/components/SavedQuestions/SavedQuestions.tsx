import { SavedQuestion } from "../../models/questions";
import style from "./SavedQuestions.module.css";

interface Props {
    savedQuestions: SavedQuestion[];
}

const SavedQuestions = ({ savedQuestions }: Props) => {
    return (
        <div className={style.savedQuestions__container}>
            <div className={style.savedQuestions__title}>Saved Questions</div>
            <table className={style.savedQuestions__table}>
                <thead className={style.savedQuestions__colHeader}>
                    <tr>
                        <th scope="col">Category</th>
                        <th scope="col">Difficulty</th>
                        <th scope="col">Type</th>
                        <th scope="col">Question</th>
                        <th scope="col">Answer</th>
                        <th scope="col">Your Answer</th>
                        <th scope="col">Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {savedQuestions?.map((item) => {
                        return (
                            <tr key={item.id}>
                                <td width="auto">{item.category}</td>
                                <td width="auto">{item.difficulty}</td>
                                <td width="auto">{item.type}</td>
                                <td width="25%">{item.question}</td>
                                <td width="25%">{item.answer}</td>
                                <td width="25%">{item.userAnswer}</td>
                                <td width="25%">{item.notes}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SavedQuestions;
