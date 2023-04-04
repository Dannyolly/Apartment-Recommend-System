import { useState } from "../useState";

export function useActionSheet(){
    return useState({
      title:'Options',
      list: [
        {
          name:'report',
        },
        {
          name: 'ban',
        },
      ],
      show: false,
    })
}