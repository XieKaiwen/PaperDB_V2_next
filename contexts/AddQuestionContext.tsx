import { AddQuestionContextProps, AddQuestionFormData, AddQuestionFormDataSubscriber } from '@/types/types'
import React, { createContext, ReactNode, useCallback, useMemo, useRef } from 'react'

const AddQuestionContext = createContext<AddQuestionContextProps | null>(null)

function AddQuestionContextProvider({ children }: { children: ReactNode }) {
    const addQuestionFormData = useRef<AddQuestionFormData>({})
    const formDataSubscribers = useRef<Set<AddQuestionFormDataSubscriber>>(new Set())
    
    const updateFormData = useCallback((updatedFormData : AddQuestionFormData) => {
        addQuestionFormData.current = updatedFormData

        formDataSubscribers.current.forEach((subscriber) => {
            subscriber(updatedFormData)
        })
    }, [])

    const subscribeToFormData = (subscriber : AddQuestionFormDataSubscriber) => {
        formDataSubscribers.current.add(subscriber)
        //  Return a cleanup function that will be called when the component unmounts to unsubcribe the subscriber
        return () => formDataSubscribers.current.delete(subscriber)
    }   

    const AddQuestionContextValue = useMemo(() => ({
        updateFormData,
        subscribeToFormData,
    }), [updateFormData, subscribeToFormData]);

    return (
        <AddQuestionContext.Provider value={AddQuestionContextValue}>
            {children}
        </AddQuestionContext.Provider>
    )
}


export {AddQuestionContext, AddQuestionContextProvider}