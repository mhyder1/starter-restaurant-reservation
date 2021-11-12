
const { exec} = require('child_process');
// const child = exec('ls');
// // console.log('error', child.error);
// console.log('stdout ', child);
// console.log('stderr ', child.stderr);
/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      }
      console.log(stdout)
      resolve(stdout);
    });
  });
}

async function runCommand(cmd) {
    try {
        return await execShellCommand(cmd)
    } catch(error) {
        console.log(error)
    }
}

async function deploy() {
    if(!process.argv[2]) {
        console.log('Please enter a name')
        return
    }

    if(process.argv[2].length > 10) {
        console.log('10 character max')
        return
    }

    let input = process.argv[2]
    let timeStamp = new Date().getTime().toString().substring(3)
    const buildPack = `-b https://github.com/mars/create-react-app-buildpack.git`
    const herokuBackend = `${input}-backend-${timeStamp}`
    const herokuFrontend = `${input}-frontend-${timeStamp} ${buildPack}`

    let createBack = `heroku create ${herokuBackend}`
    let createFront = `heroku create ${herokuFrontend}`
    let backendRemote = await runCommand(createBack)
    let frontendRemote = await runCommand(createFront)

    backendRemote = backendRemote.split('|')[1].trim()
    frontendRemote = frontendRemote.split('|')[1].trim()

    const remoteBackend = 'heroku-backend'
    const remoteFrontend = 'heroku-frontend'
    await runCommand(`git remote add ${remoteBackend} ${backendRemote}`)
    await runCommand(`git remote add ${remoteFrontend} ${frontendRemote}`)
    await runCommand('git add .')
    await runCommand('git commit -m "deploying to heroku"')
    await runCommand(`git subtree push --verbose --prefix back-end ${remoteBackend} main`)
    await runCommand(`git subtree push --verbose --prefix front-end ${remoteFrontend} main`)
    // console.log(result)
}


deploy()