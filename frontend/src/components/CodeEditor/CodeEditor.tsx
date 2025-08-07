import { basicSetup } from "codemirror";
import { useRef, useEffect, useState } from "react";
import { EditorState, Compartment } from "@codemirror/state";
import {
    EditorView,
    keymap,
    highlightSpecialChars,
    drawSelection,
    highlightActiveLine,
    dropCursor,
    rectangularSelection,
    crosshairCursor,
    lineNumbers,
    highlightActiveLineGutter,
} from "@codemirror/view";
import {
    defaultHighlightStyle,
    syntaxHighlighting,
    indentOnInput,
    bracketMatching,
    foldKeymap,
} from "@codemirror/language";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import {
    autocompletion,
    completionKeymap,
    closeBrackets,
    closeBracketsKeymap,
    acceptCompletion,
} from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";
import { Category } from "../../models/Category";
//supported langugages
import { angular } from "@codemirror/lang-angular";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { vue } from "@codemirror/lang-vue";

interface Props {
    questionCategory: Category;
    userAnswer: string;
    handleUserAnswerChanged: (newText: string) => void;
}

const CodeEditor = ({
    questionCategory,
    userAnswer,
    handleUserAnswerChanged,
}: Props) => {
    const editorRef = useRef(null);
    const viewRef = useRef<EditorView>(null);

    let language = new Compartment();

    function setLanguage(cat: Category) {
        if (cat === Category.Angular) return angular();
        else if (cat === Category.CSS) return css();
        else if (cat === Category.HTML) return html();
        else if (cat === Category.Java) return java();
        else if (cat === Category.JavaScript) return javascript();
        else if (cat === Category.JSON) return json();
        else if (cat === Category.PHP) return php();
        else if (cat === Category.Python) return python();
        else if (cat === Category.React) return javascript({ jsx: true });
        else if (cat === Category.SQL) return sql();
        else if (cat === Category.TypeScript)
            return javascript({ typescript: true });
        else if (cat === Category.Vue) return vue();

        return [];
    }

    useEffect(() => {
        if (!editorRef.current) return;

        // Initialize CodeMirror
        const state = EditorState.create({
            doc: "",
            extensions: [
                basicSetup,
                language.of(setLanguage(questionCategory)), //empty default language
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        handleUserAnswerChanged(update.state.doc.toString());
                    }
                }),
                keymap.of([{ key: "Tab", run: acceptCompletion }]),
                // A line number gutter
                lineNumbers(),
                // A gutter with code folding markers
                // foldGutter(),
                // Replace non-printable characters with placeholders
                highlightSpecialChars(),
                // The undo history
                history(),
                // Replace native cursor/selection with our own
                drawSelection(),
                // Show a drop cursor when dragging over the editor
                dropCursor(),
                // Allow multiple cursors/selections
                EditorState.allowMultipleSelections.of(true),
                // Re-indent lines when typing specific input
                indentOnInput(),
                // Highlight syntax with a default style
                syntaxHighlighting(defaultHighlightStyle),
                // Highlight matching brackets near cursor
                bracketMatching(),
                // Automatically close brackets
                closeBrackets(),
                // Load the autocompletion system
                autocompletion(),
                // Allow alt-drag to select rectangular regions
                rectangularSelection(),
                // Change the cursor to a crosshair when holding alt
                crosshairCursor(),
                // Style the current line specially
                highlightActiveLine(),
                // Style the gutter for current line specially
                highlightActiveLineGutter(),
                // Highlight text that matches the selected text
                highlightSelectionMatches(),
                keymap.of([
                    // Closed-brackets aware backspace
                    ...closeBracketsKeymap,
                    // A large set of basic bindings
                    ...defaultKeymap,
                    // Search-related keys
                    ...searchKeymap,
                    // Redo/undo keys
                    ...historyKeymap,
                    // Code folding bindings
                    ...foldKeymap,
                    // Autocompletion keys
                    ...completionKeymap,
                    // Keys related to the linter system
                    ...lintKeymap,
                ]),
                EditorView.theme({
                    "&": {
                        maxHeight: "500px",
                        border: "1px solid grey", // 👈 Add border inside CodeMirror
                        borderRadius: "5px",
                    },
                    ".cm-scroller": { overflow: "auto" },
                    ".cm-content, .cm-gutter": { minHeight: "300px" },
                }),
            ],
        });

        // Create the editor view
        viewRef.current = new EditorView({
            state,
            parent: editorRef.current,
        });

        return () => {
            viewRef.current?.destroy();
        };
    }, [questionCategory]);

    //clear text even if question category hasn't changed
    useEffect(() => {
        if (userAnswer == "") {
            if (viewRef.current) {
                viewRef.current.dispatch({
                    changes: {
                        from: 0,
                        to: viewRef.current.state.doc.length,
                        insert: userAnswer,
                    },
                });
            }
        }
    }, [userAnswer]);

    return <div ref={editorRef} className="codemirror-container"></div>;
};

export default CodeEditor;
