import React from 'react'
import { Link } from '@fluentui/react';
interface Props {
    title:string,
    url:string
}

export const WikiLink = (props: Props) => {
    return (
        <div>
            <Link href={props.url}
                underline={true}
                target="_blank">{props.title}</Link>
        </div>
    )
}
