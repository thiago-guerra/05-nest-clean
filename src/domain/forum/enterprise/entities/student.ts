import { BaseEntity } from '@/core/entities/baseEntity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface StudentProps {
  name: string
}
export class Student extends BaseEntity<StudentProps> {
  static create(props: StudentProps, id?: UniqueEntityId) {
    return new Student(props, id)
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }
}
