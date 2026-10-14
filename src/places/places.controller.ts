import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { Place } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PagesResponse } from '../common/dto/pages-response.dto';
import { FindPlacesQueryDto } from './dto/find-places-query.dto';
import { ProblemDetailsDto } from '../common/dto/problem-details.dto';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnsupportedMediaTypeResponse } from '@nestjs/swagger';

@ApiTags('Places')
@Controller({ path: 'places', version: '1' })
export class PlacesController {
    constructor (private readonly placeService: PlacesService){}

    @ApiOperation({
        summary: 'Lister les endroits',
        description: 'Retourne les endroits, avec filtrage par categorie et pagination.'
    })
    @ApiOkResponse({ description: 'Liste paginee des endroits.' })
    @ApiBadRequestResponse({ 
        description: 'Parametre de filtre ou de pagination invalide.', 
        type: ProblemDetailsDto 
    })
    @Get()
    findAll(@Query() query: FindPlacesQueryDto): Promise<PagesResponse<Place>> {
        return this.placeService.findAll(query);
    }


    @ApiOperation({
        summary: 'Creer un endroit',
        description: 'Ajoute un endroit a la collection.'
    })
    @ApiCreatedResponse({ description: 'Endroit cree.', type: Place })
    @ApiBadRequestResponse({ 
        description: 'Donnees invalides, propriete manquante ou interdite.', 
        type: ProblemDetailsDto 
    })
    @ApiUnsupportedMediaTypeResponse({ 
        description: 'Le Content-Type doit etre application/json.', 
        type: ProblemDetailsDto 
    })
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
        description: 'Aucun endroit ne possede cet identifiant.', 
        type: ProblemDetailsDto 
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
    @ApiBadRequestResponse({ 
        description: 'Donnees invalides, propriete inconnue ou controlee par le serveur.', 
        type: ProblemDetailsDto 
    })
    @ApiNotFoundResponse({ 
        description: 'Aucun endroit ne possede cet identifiant.', 
        type: ProblemDetailsDto 
    })
    @ApiUnsupportedMediaTypeResponse({ 
        description: 'Le Content-Type doit etre application/json.', 
        type: ProblemDetailsDto 
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
        description: 'Aucun endroit ne possede cet identifiant.', 
        type: ProblemDetailsDto 
    })
    @ApiConflictResponse({ 
        description: 'L\'endroit possede des appreciations.', 
        type: ProblemDetailsDto 
    })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) 
    remove(@Param('id') id: string): Promise<void> {
        return this.placeService.remove(id);
    }
}