import axios from 'axios'
import { Label } from '@fluentui/react'
import React from 'react'
import { MenuPivots } from './MenuPivots'
import { Loading } from '../helpers/Loading'
import { UnAuthorizedMessage } from '../helpers/utils'

export interface Props {}

export const AdminPage = (props: Props) => {
  /*
  @anjali to address these comments in Task 38094699
  const [isValidUser, setValidUser] = React.useState<boolean>(true)
  const [loading, setLoading] = React.useState<boolean>(false)

  
  const checkIfUserAValidAdmin = () => {
    axios.get('api/Data/IsValidUserForAdmin').then((res) => {
      if (res.data != null) {
        console.table(res.data)
        setValidUser(res.data)
      } else {
        setValidUser(false)
      }
      setLoading(false)
    })
  } 
  

    React.useEffect(() => {
        alert(isValidUser)
        setLoading(true)
        // checkIfUserAValidAdmin() 
  }, [])

  const renderAdminPivots =
    isValidUser === false ? (
      <Label> {UnAuthorizedMessage}</Label>
    ) : (
      <div>
        <MenuPivots />
      </div>
    )

    return (
    <div>
      {loading ? (
        <Loading message="Getting Data for Admin Section - hang tight" />
      ) : (
        <div>{renderAdminPivots}</div>
      )}
    </div>
  )
  */

  return <MenuPivots />
}
