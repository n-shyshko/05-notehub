import axios from "axios";
import type { Note } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

export async function fetchNotes(
  page: number,
  search: string,
  perPage: number
): Promise<{ notes: Note[]; totalPages: number }> {
  const response = await api.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    {
      params: { page, perPage, search },
    }
  );
  return response.data;
}

export async function createNote(newNote: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> {
  const response = await api.post<Note>("/notes", newNote);
  return response.data;
}

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};
