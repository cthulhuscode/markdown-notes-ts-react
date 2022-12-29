import { useRef, useState } from "react"
import { Form, Stack, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag } from "./App";


type NoteFormProps = {
  onSubmit: (data: NoteData) => void
  onAddTag: (tag: Tag) => void
  availableTags: Tag[]
} & Partial<NoteData>; // Pass the NoteData props but they're not required, they're optional


export const NoteForm = ({ 
  onSubmit,
  onAddTag,
  availableTags, 
  title="", 
  markdown="", 
  tags=[]
}: NoteFormProps) => {

  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent){
    e.preventDefault();

    onSubmit({
      title: titleRef.current!.value, 
      markdown: markdownRef.current!.value,
      tags: selectedTags
    });

    navigate("..");
  }  

  return <Form onSubmit={handleSubmit}>
    <Stack gap={4}>
      <Row>
        <Col>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control ref={titleRef} required defaultValue={title}/>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="tags">
            <Form.Label>Tags</Form.Label>
            <CreatableReactSelect               
              value={selectedTags.map(tag => {
                return { label: tag.label, value: tag.id }
              })} 
              
              isMulti 

              onChange={tags => {
                setSelectedTags(
                  tags.map(tag => {
                    return { label: tag.label, id: tag.value }
                  })
                )
              }}

              onCreateOption={label => {
                const newTag = {id: crypto.randomUUID(), label}          
                onAddTag(newTag);
                setSelectedTags(prevTag => [...prevTag, newTag])
              }}

              options={availableTags.map(tag => {
                return { label: tag.label, value: tag.id }
              })}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="markdown">
        <Form.Label>Body</Form.Label>
        <Form.Control defaultValue={markdown} required as="textarea" ref={markdownRef} rows={15}/>
      </Form.Group>

      <Stack direction="horizontal" gap={2} className="justify-content-end">
        <Button type="submit" variant="primary">Save</Button>
        {/* Go back one page when clicking cancel */}
        <Link to=".." >
          <Button type="button" variant="outline-secondary">Cancel</Button>
        </Link>
      </Stack>
    </Stack>
  </Form>
}

export default NoteForm