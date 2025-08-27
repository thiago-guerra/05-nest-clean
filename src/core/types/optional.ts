/**
 * @description Type to make some fields optional
 * @example 
 * type Todo = {
  title: string;
  description: string;
  completed: boolean;
 }
 
 type TodoPreview = Optional<Todo, 'description'>;
 
 const todo: TodoPreview = {
  title: 'Clean room',
  completed: false
 }
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
