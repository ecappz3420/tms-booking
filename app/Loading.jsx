import { Skeleton } from 'antd'
import React from 'react'

const Loading = () => {
    return (
        <div className='p-2'>
            <div className=' py-2'>
                <Skeleton.Input block active />
            </div>
            <div className="flex flex-col gap-[50px] mt-3">
                <div className='flex gap-[100px]'>
                    <Skeleton.Input active style={{ width: "250px" }} />
                    <Skeleton.Input active style={{ width: "250px" }} />
                    <Skeleton.Input active style={{ width: "250px" }} />
                </div>
                <div className='flex gap-[100px]'>
                    <Skeleton.Input active style={{ width: "250px" }} />
                    <Skeleton.Input active style={{ width: "250px" }} />
                </div>
                <div className='flex gap-[100px]'>
                    <Skeleton.Input active style={{ width: "250px" }} />
                   
                </div>
            </div>
            <div className='mt-3 py-2'>
                <Skeleton.Input block active />
            </div>
            <div className="flex flex-col gap-[50px] mt-3">
                <div className='flex gap-[100px]'>
                    <Skeleton.Input active style={{ width: "250px" }} />
                    <Skeleton.Input active style={{ width: "250px" }} />
                    <Skeleton.Input active style={{ width: "250px" }} />
                </div>
                <div className='flex gap-[100px]'>
                    <Skeleton.Input active style={{ width: "250px" }} />
                    <Skeleton.Input active style={{ width: "250px" }} />
                    <Skeleton.Input active style={{ width: "250px" }} />
                </div>
                <div className='flex gap-[100px]'>
                    <Skeleton.Input active style={{ width: "250px" }} />
                    <Skeleton.Input active style={{ width: "250px" }} />
                    <Skeleton.Input active style={{ width: "250px" }} />
                </div>
            </div>
        </div>
    )
}

export default Loading