import { useAddQuestionContext } from '@/hooks/useAddQuestionContext'
import React, { useEffect, useState } from 'react'

// TODO: fix bad setState somewhere between QuestionPreview and AddQuestionForm, likely to have happened in context

export default function QuestionPreview() {
    const {subscribeToFormData} = useAddQuestionContext()
    const [formData, setFormData] = useState({})

    useEffect(() => {
        const unsubscribeToFormData = subscribeToFormData((updatedFormData) => {
            setFormData(updatedFormData)
        })

        return () => unsubscribeToFormData()
    }, [subscribeToFormData, setFormData])
  return (
    <div>
        QuestionPreview
        <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  )
}
