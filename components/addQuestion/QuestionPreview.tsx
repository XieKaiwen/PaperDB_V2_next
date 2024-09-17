import { useAddQuestionContext } from '@/hooks/useAddQuestionContext'
import React, { useEffect, useState } from 'react'

export default function QuestionPreview() {
    const {subscribeToFormData} = useAddQuestionContext()
    const [formData, setFormData] = useState({})

    useEffect(() => {
        const unsubscribeToFormData = subscribeToFormData((updatedFormData) => {
            setFormData(updatedFormData)
        })

        return () => unsubscribeToFormData()
    }, [subscribeToFormData])
  return (
    <div>
        QuestionPreview
        <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  )
}
