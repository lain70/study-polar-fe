let confirmedPassword = ''
let userProfile = null

export function setUserProfileSession (password, profile) {
  confirmedPassword = password
  userProfile = profile
}

export function getUserProfileSession () {
  if (!confirmedPassword || !userProfile) {
    return null
  }

  return {
    confirmedPassword,
    userProfile
  }
}

export function clearUserProfileSession () {
  confirmedPassword = ''
  userProfile = null
}
