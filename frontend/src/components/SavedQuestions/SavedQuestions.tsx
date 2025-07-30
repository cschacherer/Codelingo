import "./SavedQuestions.css";
import ISavedQuestion from "../ISavedQuestion";

interface Props {
    savedQuestions: ISavedQuestion[];
}

const SavedQuestions = ({ savedQuestions }: Props) => {
    return (
        <div className="container">
            <div className="title gridItem">Saved Questions</div>
            <table>
                <thead>
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
                    {savedQuestions.map((item) => {
                        return (
                            <tr key={item.id}>
                                <td>{item.category}</td>
                                <td>{item.difficulty}</td>
                                <td>{item.type}</td>
                                <td>{item.question}</td>
                                <td>{item.answer}</td>
                                <td>{item.userAnswer}</td>
                                <td>{item.notes}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SavedQuestions;
