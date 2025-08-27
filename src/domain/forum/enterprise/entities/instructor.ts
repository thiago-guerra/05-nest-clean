import { BaseEntity } from '@/core/entities/baseEntity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface InstructorProps {
  name: string
}
export class Instructor extends BaseEntity<InstructorProps> {
  static create(props: InstructorProps, id?: UniqueEntityId) {
    return new Instructor(props, id)
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }
}
