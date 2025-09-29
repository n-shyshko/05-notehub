import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Required field"),
  content: Yup.string().max(500, "Maximum 500 symbols"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required field"),
});

function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newNote: { title: string; content: string; tag: string }) =>
      createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  return (
    <Formik<NoteFormValues>
      initialValues={{ title: "", content: "", tag: "Todo" }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        mutation.mutate(values);
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor='title'>Title</label>
            <Field id='title' name='title' type='text' className={css.input} />
            <ErrorMessage name='title' component='span' className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor='content'>Content</label>
            <Field
              id='content'
              name='content'
              as='textarea'
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name='content'
              component='span'
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor='tag'>Tag</label>
            <Field id='tag' name='tag' as='select' className={css.select}>
              <option value='Todo'>Todo</option>
              <option value='Work'>Work</option>
              <option value='Personal'>Personal</option>
              <option value='Meeting'>Meeting</option>
              <option value='Shopping'>Shopping</option>
            </Field>
            <ErrorMessage name='tag' component='span' className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type='button'
              onClick={onCancel}
              className={css.cancelButton}
            >
              Cancel
            </button>
            <button
              type='submit'
              className={css.submitButton}
              disabled={isSubmitting || mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default NoteForm;
