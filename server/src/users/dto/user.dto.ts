import { SettingsDto } from './settings.dto'
// import { PhotoDto } from '../../common/dto/photo.dto'

export class UserDto {
	constructor(object: any) {
		this.username = object.name
		this.email = object.email
		// this.phone = object.phone;
		this.settings = new SettingsDto(object.settings)
		// this.photos = {
		//   profilePic : new PhotoDto(object.photos.profilePic),
		//   gallery: []
		// }
		// if(object.photos && object.photos.gallery) {
		//   object.photos.gallery.forEach(photo => {
		//     this.photos.gallery.push(new PhotoDto(photo));
		//   });
		// }
	}
	readonly username: string
	readonly email: string
	// readonly phone: string;
	settings: SettingsDto
	contacts: {
		pending: string[] // req to user
		requests: string[] // user requests
		added: string[] // friends
	}
	// photos: {
	//   profilePic: PhotoDto;
	//   gallery: PhotoDto[];
	// };
}
