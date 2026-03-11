import Image from "next/image"

export default function Loading(){
    return(
  <div  className="flex justify-center " >

        <Image
        src="/images/loader.gif"
        alt=""
        width={200}  
        height={200}
        
        
/>

        </div>
    )
}