import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { Place } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PagesResponse } from '../common/dto/pages-response.dto';
import { FindPlacesQueryDto } from './dto/find-places-query.dto';
import { ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Places')
@Controller({ path: 'places', version: '1' })
export class PlacesController {
    constructor (private readonly placeService: PlacesService){}

    @ApiOperation({
        summary: 'Lister les endroits',
        description: 'Retourne les endroits, avec filtrage par categorie et pagination.'
    })
    @ApiOkResponse({ description: 'Liste paginee des endroits.' })
    @Get()
    findAll(@Query() query: FindPlacesQueryDto): Promise<PagesResponse<Place>> {
        return this.placeService.findAll(query);
    }


    @ApiOperation({
        summary: 'Creer un endroit',
        description: 'Ajoute un endroit a la collection.'
    })
    @ApiCreatedResponse({ description: 'Endroit cree.', type: Place })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreatePlaceDto): Promise<Place> {
        return this.placeService.create(dto);
    }


    @ApiOperation({
        summary: 'Consulter un endroit',
        description: 'Retourne un endroit precis par son identifiant.'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Identifiant de l\'endroit' 
    })
    @ApiOkResponse({ 
        description: 'Endroit trouve.', 
        type: Place 
    })
    @ApiNotFoundResponse({ 
        description: 'Aucun endroit ne possede cet identifiant.' 
    })
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Place> {
        return this.placeService.findOne(id);
    }

    
    @ApiOperation({
        summary: 'Modifier un endroit',
        description: 'Modifie partiellement un endroit existant.'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Identifiant de l\'endroit' 
    })
    @ApiOkResponse({ 
        description: 'Endroit modifie.', 
        type: Place 
    })
    @ApiNotFoundResponse({ 
        description: 'Aucun endroit ne possede cet identifiant.' 
    })
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdatePlaceDto): Promise<Place> {
        return this.placeService.update(id, dto);
    }


    @ApiOperation({
        summary: 'Supprimer un endroit',
        description: 'Supprime un endroit, sauf s\'il possede des appreciations.',
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Identifiant de l\'endroit' 
    })
    @ApiNoContentResponse({ 
        description: 'Endroit supprime.' 
    })
    @ApiNotFoundResponse({ 
        description: 'Aucun endroit ne possede cet identifiant.' 
    })
    @ApiConflictResponse({ 
        description: 'L\'endroit possede des appreciations.' 
    })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) 
    remove(@Param('id') id: string): Promise<void> {
        return this.placeService.remove(id);
    }
}
